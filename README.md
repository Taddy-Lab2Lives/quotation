# BenKon Quote Generator

A modern, professional web application for generating quotes for BenKon products (hardware + software solutions). The app allows easy input of costs, automatic calculation of rental vs purchase options, and generates PDF quotes with comparison charts.

## Features

- **Bilingual Support**: Vietnamese and English language toggle
- **Customer Information Management**: Store customer details with auto-save functionality
- **Cost Components**: Customizable hardware, software, installation, and setup costs
- **Automatic Calculations**: Real-time calculation of purchase vs rental options
- **Visual Comparisons**: Interactive charts showing cost comparisons over 24 months
- **Cash Flow Analysis**: Detailed month-by-month payment breakdown
- **PDF Generation**: Professional PDF quotes with all details and charts
- **Responsive Design**: Optimized for desktop with mobile compatibility

## Technology Stack

- **React** with TypeScript
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **jsPDF** for PDF generation
- **i18next** for internationalization

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Taddy-Lab2Lives/quotation.git
cd quotation
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Usage

1. **Select Language**: Toggle between Vietnamese and English using the language switcher
2. **Enter Customer Information**: Fill in customer details (name is required)
3. **Configure Costs**: Adjust the default cost values as needed
4. **Calculate**: Click the Calculate button to generate comparisons
5. **Review Results**: View the cost comparison, charts, and cash flow table
6. **Export**: Generate a PDF quote or print directly from the browser

## Default Cost Values

- Hardware Cost: 6,500,000 VNĐ
- Software Cost (per year): 5,000,000 VNĐ
- Installation Cost (per store): 1,600,000 VNĐ
- Setup Service (per store): 1,200,000 VNĐ

## Calculation Logic

### Purchase Option
- Month 0: Hardware + Installation + Setup + Software Year 1
- Month 13: Software Year 2
- Total 2-year cost: Sum of all payments

### Rental Option
- Monthly rental: (2-year total cost × 1.2) ÷ 24
- Month 0: 3-month deposit
- Months 1-24: Monthly rental payments
- Total 2-year cost: Deposit + (24 × monthly rental)

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment

The app can be deployed to any static hosting service:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **AWS S3**

## License

© 2024 BenKon Technology Solutions. All rights reserved.