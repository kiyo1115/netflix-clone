//データサーバにアクセスし、現在の映画の数を取得し、ランダムで一つ取得する
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
    // serverAuth.tsでリターンされた値を元にcurrentUserオブジェクトを抽出
    await serverAuth(req,res);
    //データサーバーにある映画の数をカウント
    const movieCount = await prismadb.movie.count();
    //Math.floorは小数点切り捨て、Math.random()は0～0.99を選択
    const randomIndex = Math.floor(Math.random() * movieCount)

    const randomMovies = await prismadb.movie.findMany({
        take:1,
        skip:randomIndex
    })
//api/randomに接続すると下記の値がjson形式で取得できる
    return res.status(200).json(randomMovies[0])

  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
