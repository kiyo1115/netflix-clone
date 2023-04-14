//お気に入りに入っているデータを取得している
import useSWR from "swr";
import fetcher from "../libs/fetcher";

const useFavorites = () => {
 
  const { data, error, isLoading,mutate } = useSWR("/api/favorites", fetcher, {
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
    mutate:mutate,
  };
};

export default useFavorites;