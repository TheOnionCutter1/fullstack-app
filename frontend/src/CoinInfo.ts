interface CoinInfo
{
  success: boolean;
  start_date: string;
  end_date: string;
  base: string;
  rates: {
    [date: string]: {
      [coin: string]: number
    }
  }
}

export default CoinInfo;
