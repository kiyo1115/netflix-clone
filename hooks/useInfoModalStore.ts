
import {create} from "zustand"

export interface ModalStoreInterface{
    movieId?:string;
    isOpen:boolean;
 
    // openModalが関数であることを示し、movieIdという名前の引数を受け取り、
    // その引数の型がstringであることを示しています。
    // そして、関数が何も返さないことを示すvoidが関数の戻り値の型として
    // 指定されています。
    openModal:(movieId:string) => void;
    // closeModalは引数を受け取らず、何も返さない関数の型宣言
    closeModal:() => void
}


// zustandから元々用意されているcreate関数を使用している
// create関数での引数はset、getが用意されている
const useInfoModal = create<ModalStoreInterface>((set) =>({
    // 初期値として下記を保持するように設計
    // はじめは何も持ってない値として宣言
    movieId : undefined,
    isOpen:false,
    // 変更する時はopenModalまたはcloseModalを使用して変更する
    // 宣言方法はopenModal('movie_id_123');といった感じとなる
    //上記の変更の場合に確認及び変更する場所は
    // movieIdが文字列かどうか。
    // 問題なければ、isOpenをtrueにし、movieIdの値を入れる
    //例の場合だとmovieIdは"movie_id_123"が格納される
    openModal:(movieId:string) => set({isOpen:true,movieId}),
    closeModal:() => set({isOpen:false,movieId:undefined})

}))

export default useInfoModal;
