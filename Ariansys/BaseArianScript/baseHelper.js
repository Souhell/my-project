class baseHelper {
     //static units
      static _generateNationalId() {
        let digits;
        do {
          digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
        } while (digits.every((d) => d === 0));
    
        const check =
          digits
            .map((digit, index) => digit * (10 - index))
            .reduce((sum, val) => sum + val, 0) % 11;
        const controlDigit = check < 2 ? check : 11 - check;
    
        return digits.join("") + controlDigit;
      }
    
      static _generateIranianMobile() {
        const prefixes = [
          "0910",
          "0911",
          "0912",
          "0913",
          "0914",
          "0915",
          "0916",
          "0917",
          "0918",
          "0919",
          "0920",
          "0921",
          "0922",
          "0923",
          "0930",
          "0933",
          "0935",
          "0936",
          "0937",
          "0938",
          "0939",
          "0990",
          "0991",
          "0992",
          "0993",
          "0994",
        ];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const rest = Array.from({ length: 7 }, () =>
          Math.floor(Math.random() * 10)
        ).join("");
        return prefix + rest;
      }
    
      static _generateBankCard() {
        let card = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10));
        let sum = 0;
        for (let i = 0; i < 15; i++) {
          let digit = card[14 - i];
          if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        return card.join("") + checkDigit;
      }
    
}

module.exports = baseHelper;