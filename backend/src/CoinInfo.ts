interface CoinInfo
{
  success: boolean;
  rates: {
    [date: string]: {
      [coin: string]: number
    }
  }
}

export default CoinInfo;
