# PiggyBank - Bitcoin Savings for Kids

A Bitcoin piggy bank for children to track their savings and learn about Bitcoin. The PiggyBank extension works with the Alby Browser Extension to provide a kid-friendly interface for Bitcoin education and savings.

## Features

- **Safe Savings**: Children can track their deposits in sats, but don't have withdrawal capability
- **Bitcoin Education**: Built-in links to educational resources about Bitcoin, finance, history, and math
- **Real-time Network Stats**: See up-to-date Bitcoin network information
- **Fun Interface**: Kid-friendly UI with sound effects and interactive elements

## Installation

### For Users

1. Install the Alby browser extension from [getalby.com](https://getalby.com)
2. Set up your Alby wallet or connect an existing Lightning wallet
3. Navigate to the Alby Hub store
4. Find and install "Bitcoin Piggy Bank"
5. Access PiggyBank from your Alby Hub dashboard

### For Developers

To build and test the extension locally:

1. Clone this repository:
   ```
   git clone https://github.com/ttooccooll/LIGHTNING-PIGGY-BANK.git
   ```

2. Navigate to the extension directory:
   ```
   cd PIGGYBANK/extension
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Build the extension:
   ```
   npm run build
   ```

5. Load the unpacked extension in Chrome/Firefox:
   - Chrome: Open `chrome://extensions/`, enable Developer mode, click "Load unpacked", and select the `extension` folder
   - Firefox: Open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select any file in the `extension` folder

## Usage

1. Open the PiggyBank from your Alby Hub dashboard
2. Generate a Lightning invoice to receive Bitcoin deposits
3. Explore educational content via the History, Latin, Finance, and Math buttons
4. View your transaction history in the bottom panel
5. Click "Go outside and play!" when you're done to logout

## Development

This extension uses:
- React for the UI
- WebLN for Lightning Network integration
- Alby's WebExtension API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.