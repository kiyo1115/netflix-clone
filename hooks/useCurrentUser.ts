//データベースのuser部分のデータを取得している
import useSWR from "swr";
import fetcher from "../libs/fetcher";

// import {} from "../pages/api/current"

const useCurrentUser = () => {
  // ブラウザー上でのデータの取得とキャッシュ、そして表示の最適化を自動的に行ってくれます。
//もし、fetcherがlocalhots:3000だった場合のアクセス先のURLは（この場合は"localhost:3000/api/current"）を取得しに行きます。
// api/currentに接続しているが、このcurrentではそのユーザーのemailアドレスを取得しているため
// そのユーザーのデータが取得できている
  const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher);
  //分割した状態の情報をreturnでuseCurrentUserを使うところへ返す
  return {
    data: data,
    error: error,
    isLoading: isLoading,
    mutate: mutate,
  };
};

export default useCurrentUser