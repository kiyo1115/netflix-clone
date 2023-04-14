//emailの情報を元にユーザー情報の全体を取得している
import { NextApiRequest,NextApiResponse  } from "next";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

import prismadb from "../libs/prismadb"

import { authOptions } from "../pages/api/auth/[...nextauth]";

const serverAuth = async(req:NextApiRequest, res: NextApiResponse) =>{
    // const session = await getSession({req})
    const session = await getServerSession(req, res, authOptions);

    // sessionオブジェクトが存在しない、またはuserプロパティが存在しない、
    // またはemailプロパティが存在しない場合、例外をスローして処理を中断します。
    if(!session?.user?.email){
        throw new Error("not signed in")
    }

    //emailのデータが見つかった人のユーザーのデータを取得する
    const currentUser = await prismadb.user.findUnique({
        where:{
            email:session.user.email
        }
    })

    //emailのデータが見つからなかった人は例外をスローして処理を中断します。
    if(!currentUser){
        throw new Error("not signed in")
    }

    // serverAuthを実行するとemailを起点として
    // 見つけたユーザーのオブジェクトを格納しリターンする
    return {currentUser}
    //*pages/api/current.tsで使用されている*
}

export default serverAuth

