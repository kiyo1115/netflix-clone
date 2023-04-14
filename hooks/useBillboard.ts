//データベースのmovie部分のデータを取得しているがブラウザに
//自動で出力するために特化した内容のデータを取得している
import useSWR from "swr";
import fetcher from "../libs/fetcher";

const useBillboard = () => {
  // ブラウザー上でのデータの取得とキャッシュ、そして表示の最適化を自動的に行ってくれます。
  //もし、fetcherがlocalhots:3000だった場合のアクセス先のURLは（この場合は"localhost:3000/api/current"）を取得しに行きます。
  // api/currentに接続しているが、このcurrentではそのユーザーのemailアドレスを取得しているため
  // そのユーザーのデータが取得できている
  const { data, error, isLoading } = useSWR("/api/random", fetcher, {
    //https://swr.vercel.app/ja/docs/apiのoption
    // この第三引数にはオプションが追加できる
    // キャッシュが古くなったときに再検証するかどうかを指定します。falseに設定すると、キャッシュが古くなっても再検証されません。
    revalidateIfStale: false,
    // ブラウザウィンドウがフォーカスされたときに再検証するかどうかを指定します。falseに設定すると、ブラウザウィンドウがフォーカスされても再検証されません。
    revalidateOnFocus: false,
    // オフラインモードからオンラインモードに戻ったときに再検証するかどうかを指定します。falseに設定すると、オフラインモードからオンラインモードに戻っても再検証されません。
    revalidateOnReconnect: false,
  });
  //分割した状態の情報をreturnでuseCurrentUserを使うところへ返す
  return {
    data: data,
    error: error,
    isLoading: isLoading,
  };
};

export default useBillboard;
