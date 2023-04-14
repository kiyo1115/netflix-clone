import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "../../libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   通信方式がGETだった場合はエラーを返し終了する

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    // serverAuth.tsでリターンされた値を元にcurrentUserオブジェクトを抽出
    const { currentUser } = await serverAuth(req,res);

    // api/currentへ接続すると
    // 上記で取得したemailのオブジェクトではなく変数として取得できる
    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
