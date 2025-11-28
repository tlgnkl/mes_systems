# Routing Practice

This project implements the React Routing tutorial instructions.

## Setup

1. Open a terminal in this folder:
   ```bash
   cd 22nov/routing-practice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

## Features

- **Navigation**: Links to Home, User Profiles, Products, and Category Products.
- **Dynamic Routing**: Handles `/user/:userId`, `/product/:productId`, and `/category/:categoryName/product/:productId`.
- **Data Handling**: Displays mock data based on URL parameters.
- **Error Handling**: Shows appropriate messages for non-existent users or products.
- **Breadcrumbs**: Dynamic breadcrumb navigation based on the current path.
