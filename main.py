from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
from enum import Enum

app = FastAPI(title="DCM Syndicate Pricing API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enums
class Sector(str, Enum):
    UTILITY = "utility"
    BANK = "bank"
    INDUSTRIAL = "industrial"

class Rating(str, Enum):
    AAA = "AAA"
    AA = "AA"
    A = "A"
    BBB = "BBB"

class Currency(str, Enum):
    GBP = "GBP"
    EUR = "EUR"
    USD = "USD"

class MarketCondition(str, Enum):
    QUIET_WEEK = "quiet_week"
    BUSY_WEEK = "busy_week"
    CENTRAL_BANK_MEETING = "central_bank_meeting"
    NORMAL = "normal"

# Models
class BondRequest(BaseModel):
    company_name: str
    sector: Sector
    rating: Rating
    deal_size_million: int
    preferred_currency: Currency
    market_condition: MarketCondition
    base_currency: Currency = Currency.GBP

class PricingResponse(BaseModel):
    company_name: str
    direct_pricing: dict
    currency_comparison: list
    recommendations: dict
    financial_impact: dict

# Pricing Calculator
class SyndicatePricingCalculator:
    
    def __init__(self):
        self.government_rates = {
            "GBP": 4.0,
            "EUR": 2.5,
            "USD": 4.5
        }
        
        self.credit_spreads = {
            "utility": {
                "AAA": {"GBP": 80, "EUR": 85, "USD": 75},
                "AA": {"GBP": 100, "EUR": 105, "USD": 95},
                "A": {"GBP": 120, "EUR": 125, "USD": 115},
                "BBB": {"GBP": 180, "EUR": 190, "USD": 170}
            },
            "bank": {
                "AAA": {"GBP": 60, "EUR": 70, "USD": 55},
                "AA": {"GBP": 80, "EUR": 90, "USD": 75},
                "A": {"GBP": 100, "EUR": 110, "USD": 95},
                "BBB": {"GBP": 150, "EUR": 165, "USD": 140}
            },
            "industrial": {
                "AAA": {"GBP": 100, "EUR": 110, "USD": 95},
                "AA": {"GBP": 130, "EUR": 140, "USD": 125},
                "A": {"GBP": 160, "EUR": 175, "USD": 150},
                "BBB": {"GBP": 220, "EUR": 240, "USD": 210}
            }
        }
        
        self.market_adjustments = {
            "quiet_week": -10,
            "busy_week": 15,
            "central_bank_meeting": 20,
            "normal": 0
        }
        
        self.size_adjustments = {
            100: 0, 250: 5, 500: 10, 750: 15, 1000: 20
        }
        
        self.swap_costs = {
            "EUR_to_GBP": 80,
            "USD_to_GBP": 30,
            "GBP_to_EUR": 75,
            "USD_to_EUR": 45,
            "GBP_to_USD": 35,
            "EUR_to_USD": 50
        }
    
    def calculate_all_in_cost(self, currency: str, sector: str, rating: str, 
                             deal_size: int, market_condition: str, 
                             base_currency: str) -> Dict:
        # Base government rate
        base_rate = self.government_rates[currency]
        
        # Credit spread
        credit_spread = self.credit_spreads[sector][rating][currency]
        
        # Size adjustment
        size_key = min(self.size_adjustments.keys(), 
                      key=lambda x: abs(x - deal_size))
        size_adjustment = self.size_adjustments[size_key]
        
        # Market condition adjustment
        market_adjustment = self.market_adjustments[market_condition]
        
        # Calculate base cost
        spread_total = credit_spread + size_adjustment + market_adjustment
        base_cost = base_rate + (spread_total / 100)
        
        # Add swap cost if different currency
        swap_cost = 0
        if currency != base_currency:
            swap_key = f"{currency}_to_{base_currency}"
            swap_cost = self.swap_costs.get(swap_key, 0) / 100
        
        all_in_cost = base_cost + swap_cost
        
        return {
            "currency": currency,
            "base_rate": base_rate,
            "credit_spread_bps": credit_spread,
            "size_adjustment_bps": size_adjustment,
            "market_adjustment_bps": market_adjustment,
            "swap_cost_bps": int(swap_cost * 100),
            "all_in_cost_percent": round(all_in_cost, 3),
            "breakdown": {
                "government_rate": f"{base_rate:.1f}%",
                "credit_spread": f"+{credit_spread} bps",
                "size_premium": f"+{size_adjustment} bps",
                "market_adjustment": f"{market_adjustment:+d} bps",
                "swap_cost": f"+{int(swap_cost * 100)} bps" if swap_cost > 0 else "0 bps",
                "total": f"{all_in_cost:.2f}%"
            }
        }
    
    def calculate_financial_impact(self, deal_size: int, pricing_results: List[Dict]) -> Dict:
        results = {}
        base_case = pricing_results[0]
        
        for result in pricing_results:
            annual_cost = deal_size * result["all_in_cost_percent"] / 100
            results[result["currency"]] = {
                "annual_cost_millions": round(annual_cost, 1),
                "ten_year_cost_millions": round(annual_cost * 10, 1)
            }
        
        # Find cheapest option
        cheapest = min(pricing_results, key=lambda x: x["all_in_cost_percent"])
        if cheapest["currency"] != base_case["currency"]:
            savings_bps = int((base_case["all_in_cost_percent"] - cheapest["all_in_cost_percent"]) * 100)
            annual_savings = deal_size * (base_case["all_in_cost_percent"] - cheapest["all_in_cost_percent"]) / 100
            
            results["recommendation"] = {
                "optimal_currency": cheapest["currency"],
                "savings_vs_base_bps": savings_bps,
                "annual_savings_millions": round(annual_savings, 1),
                "ten_year_savings_millions": round(annual_savings * 10, 1)
            }
        
        return results
    
    def generate_pricing_analysis(self, request: BondRequest) -> dict:
        # Calculate pricing for all currencies
        currencies = ["GBP", "EUR", "USD"]
        pricing_results = []
        
        for currency in currencies:
            result = self.calculate_all_in_cost(
                currency=currency,
                sector=request.sector.value,
                rating=request.rating.value,
                deal_size=request.deal_size_million,
                market_condition=request.market_condition.value,
                base_currency=request.base_currency.value
            )
            pricing_results.append(result)
        
        # Financial impact analysis
        financial_impact = self.calculate_financial_impact(
            request.deal_size_million, pricing_results
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(pricing_results, request)
        
        # Find direct pricing (in base currency)
        direct_pricing = next(r for r in pricing_results if r["currency"] == request.base_currency.value)
        
        return {
            "company_name": request.company_name,
            "direct_pricing": direct_pricing,
            "currency_comparison": pricing_results,
            "recommendations": recommendations,
            "financial_impact": financial_impact
        }
    
    def _generate_recommendations(self, pricing_results: List[Dict], request: BondRequest) -> Dict:
        cheapest = min(pricing_results, key=lambda x: x["all_in_cost_percent"])
        
        recommendations = {
            "optimal_currency": cheapest["currency"],
            "rationale": f"Issue in {cheapest['currency']} for lowest all-in cost",
            "market_timing": self._get_market_timing_advice(request.market_condition.value),
            "alternative_strategies": []
        }
        
        # Add alternative strategies
        if request.market_condition == MarketCondition.CENTRAL_BANK_MEETING:
            recommendations["alternative_strategies"].append(
                "Consider waiting until after central bank meeting to avoid 20 bps uncertainty premium"
            )
        
        if request.deal_size_million >= 750:
            recommendations["alternative_strategies"].append(
                f"Consider splitting into 2x £{request.deal_size_million//2}m deals to improve liquidity and reduce size premium"
            )
        
        return recommendations
    
    def _get_market_timing_advice(self, condition: str) -> str:
        advice = {
            "quiet_week": "Excellent timing - light issuance calendar provides 10 bps benefit",
            "busy_week": "Consider delaying - heavy issuance calendar adding 15 bps premium",
            "central_bank_meeting": "High uncertainty - consider waiting until after central bank decision",
            "normal": "Neutral market conditions - proceed when ready"
        }
        return advice.get(condition, "Normal market conditions")

# Initialize calculator
calculator = SyndicatePricingCalculator()

# Routes
@app.get("/")
async def root():
    return {"message": "DCM Syndicate Pricing API", "version": "1.0"}

@app.post("/api/pricing/calculate")
async def calculate_pricing(request: BondRequest):
    """Calculate bond pricing across currencies"""
    result = calculator.generate_pricing_analysis(request)
    return result

@app.get("/api/market/rates")
async def get_current_rates():
    """Get current government bond rates"""
    return calculator.government_rates

@app.get("/api/market/spreads/{sector}/{rating}")
async def get_sector_spreads(sector: Sector, rating: Rating):
    """Get typical credit spreads for sector/rating"""
    return calculator.credit_spreads.get(sector.value, {}).get(rating.value, {})

@app.get("/api/sectors")
async def get_sectors():
    """Get available sectors"""
    return [s.value for s in Sector]

@app.get("/api/ratings")
async def get_ratings():
    """Get available ratings"""
    return [r.value for r in Rating]

@app.get("/api/currencies")
async def get_currencies():
    """Get available currencies"""
    return [c.value for c in Currency]

@app.get("/api/market-conditions")
async def get_market_conditions():
    """Get available market conditions"""
    return [{"value": m.value, "label": m.value.replace("_", " ").title()} for m in MarketCondition]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)