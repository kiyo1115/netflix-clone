//お気に入りに登録されているリストを出力する
import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "../../libs/prismadb";
import serverAuth from "../../libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req,res);

    const favoriteMovies = await prismadb.movie.findMany({
      where: {
        id: {
          // equals: 指定した値に等しいものを取得します。
          // not: 指定した条件に合致しないものを取得します。
          // gt: 指定した値より大きいものを取得します。
          // lt: 指定した値より小さいものを取得します。
          // gte: 指定した値以上のものを取得します。
          // lte: 指定した値以下のものを取得します。
          // in: 指定した配列に含まれるものを取得します。
          // notIn: 指定した配列に含まれないものを取得します。
          // contains: 指定した文字列を含むものを取得します。
          // startsWith: 指定した文字列で始まるものを取得します。
          // endsWith: 指定した文字列で終わるものを取得します。
          // AND: 複数の条件をAND演算で結合します。
          // OR: 複数の条件をOR演算で結合します。

          //下記処理はcurrentUserの中にIDが入っていればその情報を返す
          //また、?.をつけていることで、もしnullやunderfineでも
          //エラーを出力しないようにしている
          in: currentUser?.favoriteIds,
        },
      },
    });

    return res.status(200).json(favoriteMovies);
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
}
