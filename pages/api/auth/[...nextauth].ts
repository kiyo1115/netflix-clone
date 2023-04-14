// next-authライブラリとCredentialsプロバイダー、prismadbライブラリをインポートする
import NextAuth,{AuthOptions} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prismadb from "../../../libs/prismadb";
import { compare } from "bcrypt";

import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import {PrismaAdapter} from "@next-auth/prisma-adapter"
// console.log(`github = ${process.env.GITHUB_ID}`)


// 以下の設定でCredentialsプロバイダーオブジェクトがproviders配列内に含まれるようにNextAuthオブジェクトをエクスポートする
export const authOptions: AuthOptions = {

  //自作のプロバイダーを作成し、認証できるようにしている
  providers: [
      // 元々あるgoogle認証やgithubなどは作成しなくてもnext-authの中に事前にプログラムが用意されている
      GithubProvider({
        clientId: process.env.GITHUB_ID || '',
        clientSecret: process.env.GITHUB_SECRET || '',
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      }),
    // Credentialsプロバイダーオブジェクトの設定（自作）
    Credentials({
      id: "credentials", // プロバイダーの一意のID
      name: "Credentials", // プロバイダー名
      credentials: {
        email: {
          label: "Email", // ログインフォームのメールアドレスフィールドのラベル表示
          type: "text", // 入力フィールドの種類
        },
        password: {
          label: "Password", // パスワードフィールドのラベル表示
          type: "Password", // 入力フィールドの種類
        },
      },
      //authorizeは固定の関数のため、別名にすると動かなくなる
      async authorize(credentials) {
        

        // ユーザーがメールアドレスまたはパスワードを提供しなかった場合はエラーをスローする
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードが必要です");
        }
        // メソッドが呼び出され、データベースから提供されたメールアドレスを持つユーザーを探します。この関数は非同期処理であるため、 await キーワードで呼び出されます。この処理が完了すると、結果は user 変数に格納されます。
        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        // user が定義されておらず、または hashedPassword プロパティが存在しない場合は、エラーメッセージがスローされます。これは、提供されたメールアドレスがデータベースに存在しない場合、またはユーザー情報が不完全な場合に発生します。
        if (!user ||!user.hashedPassword) {
          throw new Error("メールアドレスが存在しません");
        }
        // bcrypt.compare() メソッドが呼び出され、提供されたパスワードが、データベース内のハッシュ化されたパスワードと一致するかどうかを確認します。
        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        // isCorrectPassword 変数が false の場合、認証に失敗し、エラーがスローされます。それ以外の場合は、 user 変数に格納されたユーザー情報が正しいことが証明され、 authorize() 関数は user を返します。
        if(!isCorrectPassword){
            throw new Error("パスワードが違います");
        }

        return user;
      },
    }),
  ],
  // pages キーでは、サインインページの場所が指定されています。
  pages:{
    signIn:"/auth"
  },
  // 開発時に機能をテストするために使用されます。
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prismadb),
  // セッションオブジェクトの設定を指定しています
  session:{
    strategy:"jwt"
  },
  // JWTトークンの設定を指定しています
  jwt:{
    secret:process.env.NEXTAUTH_JWT_SECRET,
  },
  // 独自のランダムな文字列を指定します。
  secret:process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);