//current.tsを実行し、serverAuth.ts経由で現在のemailにてユーザーを判別
//ユーザーがわかれば、fetcher経由でlocalhost:3000を取得
//useSWRにて、fetcherのapi/currentへアクセスし、取得したファイルがuseCurrentUser
//このデータにはdata,error,isLoading,mutateの４つのオブジェクトが入っている
import useCurrentUser from "../hooks/useCurrentUser";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

export async function getServerSideProps(context: NextPageContext) {
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

const Profiles = () => {
  const router = useRouter();
    // ../hooks/useCurrentUserから分割代入されていたdataだけを取得し、
  // dataだとわかりにくいので、名称をuserに変更している
  // つまり以降はuserと書いていたらuseCurrentUserのdataのこと
  // ちなみに、このdataはオブジェクトが入っているはず
  const { data: user } = useCurrentUser();

  return (
    <div className="flex items-center h-full justify-center">
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-6xl text-white text-center">
          who is watching?
        </h1>
        <div className="flex items-center justify-center gap-8 mt-10">
          <div onClick={() => router.push("/")}>
            {/* groupは元々tailwindcssにはないクラス名　つまり普通にクラス名をつけた状態*/}
            <div className="group flex-row w-44 mx-auto">
              <div
                className="
                    w-44
                    h-44 
                    rounded-md 
                    flex 
                    items-center 
                    justify-center 
                    border-2 
                    border-transparent 
                    group-hover:cursor-pointer
                    group-hover:border-white 
                    overflow-hidden
                    "
              >
                <img src="/images/default-blue.png" alt="Profile" />
              </div>

              <div
                className="
              mt-4 text-gray-400 text-2xl text-center group-hover:text-white
              "
              >
                {user?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <p className="text-white text-4xl">Profiles</p>
            <p className="text-white">{user?.name}</p> */}
    </div>
  );
};

export default Profiles;
