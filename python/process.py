#!/usr/bin/env python3
import sys
import pandas as pd
import json
from mcp_risk_calculator import MCPRiskCalculator

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input file provided"}))
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    try:
        # Initialize the risk calculator
        calculator = MCPRiskCalculator('fact_risk_compliance_abstractrisk_master_latest.csv')
        
        # Read the input file
        suppliers = []
        with open(input_file, 'r') as f:
            for line in f:
                parts = line.strip().split(',', 1)
                if len(parts) == 2:
                    supplier_name = parts[0].strip()
                    country = parts[1].strip()
                    if supplier_name and country:
                        suppliers.append((supplier_name, country))
        
        if not suppliers:
            print(json.dumps({"error": "No valid supplier data provided"}))
            sys.exit(1)
        
        # Process the supplier data
        results = calculator.process_supplier_list(suppliers)
        df = calculator.format_risk_table(results)
        
        # Convert risk scores to numeric type
        risk_columns = [col for col in df.columns if col not in ['Supplier Name', 'Country']]
        for col in risk_columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Prepare output formats
        table_html = df.to_html(classes='table table-striped table-bordered', index=False)
        csv_data = df.to_csv(index=False)
        json_data = json.loads(df.to_json(orient='records'))
        
        # Return the results
        print(json.dumps({
            'table': table_html,
            'csv': csv_data,
            'data': json_data
        }))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()

