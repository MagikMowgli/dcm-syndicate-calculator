# DCM Syndicate Pricing Calculator 📊

A professional bond pricing tool that helps debt capital markets teams find the cheapest funding source across multiple currencies, accounting for FX swap costs and market conditions.

## 🚀 Quick Start Guide

### What Does This Tool Do?

Imagine you're a UK company needing to borrow £500 million. Should you:
- Issue bonds in GBP directly? 
- Issue in EUR and swap back to GBP?
- Issue in USD and swap back to GBP?

This calculator instantly shows you which option is cheapest after including all costs, potentially saving millions in interest payments.

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- Git (for cloning the repository)

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/dcm-syndicate-calculator.git
cd dcm-syndicate-calculator
```

### Step 2: Set Up the Backend (Python API)

```bash
# Create a virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```

✅ Backend should now be running at `http://localhost:8000`

### Step 3: Set Up the Frontend (React App)

Open a **new terminal window** and:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

✅ Frontend should open automatically at `http://localhost:3000`

## 🎯 How to Use the Calculator

### 1. Enter Bond Details

- **Company Name**: Your company's name (e.g., "British Telecom")
- **Sector**: Choose your industry:
  - `Utility`: Power, water, telecoms (medium risk)
  - `Bank`: Financial institutions (lowest spreads)
  - `Industrial`: Manufacturing, retail (highest spreads)
- **Rating**: Your credit rating (AAA = best, BBB = lowest investment grade)
- **Deal Size**: How much you want to borrow (£100m - £1bn)
- **Market Condition**: Current market environment

### 2. Understanding Market Conditions

- **Quiet Week** ✅: Few other bonds being issued = CHEAPER (-10 bps)
- **Normal**: Average market conditions
- **Busy Week** ⚠️: Many competing issues = EXPENSIVE (+15 bps)
- **Central Bank Meeting** 🏛️: High uncertainty = VERY EXPENSIVE (+20 bps)

### 3. Click "Calculate Pricing"

The calculator will show you:

#### Currency Comparison Chart
- Visual comparison of total costs in GBP, EUR, and USD
- Includes swap costs back to your base currency

#### Pricing Breakdown
For each component:
- **Government Rate**: Base risk-free rate (UK Gilt, German Bund, US Treasury)
- **Credit Spread**: Your company's risk premium
- **Size Premium**: Extra cost for larger deals
- **Market Adjustment**: Timing impact
- **Swap Cost**: Cost to convert foreign currency back to GBP
- **Total All-in Cost**: Your actual borrowing rate

#### Financial Impact
- **Annual Cost**: Yearly interest payment in millions
- **10-Year Cost**: Total interest over standard bond life
- **Potential Savings**: If a foreign currency is cheaper

#### Smart Recommendations
- Which currency to issue in
- Whether to wait for better market conditions
- If you should split large deals into smaller tranches

## 💡 Example Scenario

**British Telecom** (Utility, A-rated) needs £500m in a normal market:

1. **GBP Direct**: 5.30% all-in cost = £26.5m/year
2. **EUR with Swap**: 4.50% all-in cost = £22.5m/year
3. **USD with Swap**: 5.95% all-in cost = £29.75m/year

**Recommendation**: Issue in EUR and swap to GBP, saving £4m/year (£40m over 10 years)!

## 📊 Understanding the Results

### Why Different Currencies?
- **Government Rates Vary**: German Bunds (2.5%) vs UK Gilts (4.0%) vs US Treasuries (4.5%)
- **Credit Spreads Differ**: European investors might view your credit differently
- **Swap Costs**: Converting EUR→GBP costs ~75bps, but USD→GBP only ~30bps

### Basis Points (bps) Explained
- 1 basis point = 0.01%
- 100 basis points = 1.00%
- On £500m: 10bps = £500k/year

### When to Issue Bonds
- ✅ **Best**: Quiet week with light issuance calendar
- ⚠️ **Avoid**: Busy weeks or central bank meetings
- 💰 **Savings**: Timing can save 20-30bps (£1-1.5m/year on £500m)

## 🛠️ Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:8000

# View API documentation
open http://localhost:8000/docs
```

### Frontend Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Common Errors
- **"Module not found"**: Run `npm install` in the frontend directory
- **"Port already in use"**: Kill existing processes or use different ports
- **"CORS error"**: Ensure backend is running before starting frontend

## 📈 Advanced Features

### API Endpoints
- `POST /api/pricing/calculate`: Main calculation endpoint
- `GET /api/market/rates`: Current government bond rates
- `GET /api/market/spreads/{sector}/{rating}`: Credit spread data

### Customisation
Edit `main.py` to adjust:
- Government rates (line ~50)
- Credit spreads by sector/rating (line ~55)
- Swap costs between currencies (line ~85)
- Market condition adjustments (line ~70)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 Licence

MIT Licence - feel free to use this calculator for your own projects!

## ❓ FAQ

**Q: Why do swap costs exist?**
A: When you borrow in EUR but need GBP, you must exchange currencies for 10 years. Banks charge for this long-term currency hedge.

**Q: What's a "credit spread"?**
A: The extra yield investors demand above government bonds to compensate for your company's default risk.

**Q: Why are bank spreads tighter than industrials?**
A: Banks are heavily regulated with strict capital requirements, making them generally safer for bondholders.

**Q: Should I always pick the cheapest currency?**
A: Usually yes, but consider: accounting treatment, investor base diversification, and natural currency hedges from your revenues.

---

Built with ❤️ using Python FastAPI and React - Mahdi