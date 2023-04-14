import {prismaClient} from "@prisma/client"

declare global{
    //prismadbを宣言するために、必ず必要な名前空間をまず作成する
    namespace globalThis{
        //prismaClientは型の宣言。つまりprismadb自体はこの時点では空白で型だけ宣言している状態
        var prismadb:prismaClient
    }
}