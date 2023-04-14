//お気に入りの追加、削除を行う
import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from "../../libs/prismadb";
import serverAuth from "../../libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    //クライアントがお気に入りボタンを押した場合は下記の処理へ

    if (req.method === "POST") {
      //登録されているemailじゃなければ、catchの処理へ
      const { currentUser } = await serverAuth(req,res);
 

      //クリックなどで送信されたreqにbody要素がおそらくあり
      //その中からmovieIdだけを取り出す
      const { movieId } = req.body;

   

      //prismadb経由でmongodbにアクセスし、対象データがあれば
      //existingMovieに返す？
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      if (!existingMovie) {
        throw new Error("無効なID");
      }
      //userのfavoriteIdsにデータを配列として追加する
      const user = await prismadb.user.update({
        // 現在ログインしているユーザーのemailに一致する行を検索しています。
        where: {
          // currentUser.emailが空文字列の場合、デフォルト値として空文字列を使用します。
          email: currentUser.email || "",
        },
        // update メソッドに対して必ず data オブジェクトが必要
        data: {
          // 特定の条件に一致するuserのfavoriteIds フィールドに movieId を追加する
          favoriteIds: {
            // プリズマDBで利用可能なメソッドの一覧
            // set: 指定した値でフィールドを上書きします。
            // increment: 数値フィールドの値を増加させます。
            // decrement: 数値フィールドの値を減少させます。
            // multiply: 数値フィールドの値に指定した数値を乗算します。
            // divide: 数値フィールドの値に指定した数値で除算します。
            // push: 配列フィールドの末尾に値を追加します。
            // prepend: 配列フィールドの先頭に値を追加します。
            // deleteAt: 配列フィールドの指定した位置の要素を削除します。
            // delete: 配列フィールドから指定した値を持つ要素を削除します。
            // pull: 配列フィールドからすべての指定した値を持つ要素を削除します。
            // updateAt: 配列フィールドの指定した位置の要素を更新します。
            push: movieId,
          },
        },
      });
      // クライアントがお気に入りボタンを押した場合
      return res.status(200).json(user);
    }
    //クライアントがお気に入りボタンを解除した場合は下記の処理へ
    if (req.method === "DELETE") {
      const { currentUser } = await serverAuth(req,res);
      
      //削除対象のIDが入る
      //DELETEメソッドの第二引数→ { data: { movieId:movieId } }がreq.bodyに入り
      // movieIdに定義される
      const { movieId } = req.body;

      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      if (!existingMovie) {
        throw new Error("無効なID");
      }
      // 第1引数に配列を取り、第2引数以降に指定された値を配列から削除した新しい配列を返します
      // また以下の処理は元からあるcurrentUser.favoriteIdsには影響を与えず、
      // あくまでupdateFavoriteIdsという配列をwithoutの処理後に格納されたもの（コピー後に削除と捉えてよい）
      //配列をコピーし、削除の処理が加えられたものがupdateFavoriteIdsで
      //currentUser.favoriteIdsは削除されないで残っている状態
      const updateFavoriteIds = without(currentUser.favoriteIds, movieId);

      const updateUser = await prismadb.user.update({
        // 現在ログインしているユーザーのemailに一致する行を検索しています。
        where: {
          // currentUser.emailが空文字列の場合、デフォルト値として空文字列を使用します。
          email: currentUser.email || "",
        },
        // update メソッドに対して必ず data オブジェクトが必要
        data: {
          favoriteIds: {
            set: updateFavoriteIds,
          },
        },
      });
      // クライアントがお気に入りボタンを解除
      return res.status(200).json(updateUser);
    }

    //postまたはdeleteメソッドじゃない場合は405のえらーを出力する
    return res.status(405).end();
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
