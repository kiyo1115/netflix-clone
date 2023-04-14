import Billborad from "../components/Billboard";
import Navbar from "../components/Navbar";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import MovieList from "../components/MovieList";
import useMovieList from "../hooks/useMovieList";
import useFavorites from "../hooks/useFavorites";
import InfoModal from "../components/InfoModal";
import useInfoModal from "../hooks/useInfoModalStore";

// signOutでセッションを切ることにより、強制的に/authを使っている
// クライアントからルートディレクトリにアクセスするときに実行される関数です。
// 具体的には、ユーザーがルートディレクトリにアクセスするたびに、
// getServerSidePropsは実行され、セッションがあるかどうかを確認し、
// 必要に応じてリダイレクトを行う。

// また、getServerSideProps自体がnext.jsの固定の関数
// つまり、読み込み時にサーバーサイドの固定の関数が走瑠葉になっている
export async function getServerSideProps(context: NextPageContext) {
  //オブジェクト型のcontextを取りに行く（デフォルトはNextPageContext）
  // 利用可能なセッションがあるかを確認
  // console.log(context)

  const session = await getSession(context);
  //セッションに何もなければ
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        parmanent: false,
      },
    };
  }

  // getServerSidePropsには必ず何かしらを返さないといけないため、空のオブジェクトを返している
  return {
    props: {},
  };
}

export default function Home() {
  // もしdataに値がなければ、変数movieを空の配列として設定
  //データがあった場合はuseMovieListに格納されている
  // dataをmoviesという変数に格納する
  const { data: movies = [] } = useMovieList();
  const { data: favorites = [] } = useFavorites();
  const {isOpen,closeModal} = useInfoModal();

  return (
    <>
      <InfoModal visible={isOpen} onClose={() => closeModal()} />
      <Navbar />
      <Billborad />
      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />
      </div>
    </>
  );
}

// ここの処理は明日確認すること
// getServerSidePropsがいつ実行されているのか
//signOutの中身はどうなっているのか
