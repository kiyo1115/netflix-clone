import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "../../libs/prismadb";

//registerをするときにこのjsファイルが入るようにする
// reqにはauth.tsxからきた処理を操作する。
// 流れとしてはauth.tsxのregisterのボタンを押したら
// reqにデータがきて、そのデータを分割代入でemail,name,passwordを格納
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    // 正常にpostとして情報が渡ってきていたら、情報をそれぞれの定数に代入
    const { email, name, password } = req.body;

    // mongodbのデータベースのメールアドレスを見に行き同じメールアドレスがないかを確認する
    //prismadb==基本的にmongodbと考えてよい
    const existingUser = await prismadb.user.findUnique({
      where: {
        email: email,
      },
    });

    //データベースを検索して、同じメールアドレスがあった場合は下記の処理をする
    if (existingUser) {
      return res.status(422).json({ error: "Emailが存在します" });
    }

    //パスワードを12桁で暗号化する
    const hashedPassword = await bcrypt.hash(password,12)

    //スキーマの構成と相違がないように定義したデータを新たに生成する
    const user = await prismadb.user.create({
        data: {
          email:email,
          name:name,
          hashedPassword:hashedPassword,
          image: '',
          emailVerified: new Date(),
        }
      })

      return res.status(200).json(user)

  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
