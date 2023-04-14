//このままでは使用できないが、アクセス先のurlからデータを取得している
import axios from "axios";

///hooks/useCurrentUser.tsで使用されている
// useCurrentUser.tsで"/api/current"を指定している
// つまり、第一引数に/api/currentを持った状態で実行している
//res.dataに、ログイン情報オブジェクトが格納されている
//resの中にはconfigなどがあるがそこは不要
const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export default fetcher;
