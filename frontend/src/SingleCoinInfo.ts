interface SingleCoinInfo
{
  coin: string;
  rates: {
    [date: string]: number
  }
}

export default SingleCoinInfo;
