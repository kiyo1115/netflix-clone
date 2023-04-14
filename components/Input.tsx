import React from "react";

interface InputProps {
  id: string;
  onChange: any;
  value: string;
  label: string;
  type?: string; //必須のプロパティではないときにつける　「？」
}
// React.FCはreactのコンポネントであることを明示している

const Input = ({ id, onChange, value, label, type }: InputProps) => {//typescriptでの簡易的な宣言
// const Input: React.FC<InputProps> = ({ id, onChange, value, label, type }) => {
  // const Input= () => {//javascriptでの宣言

  return (
    <div className="relative">
      <input
        onChange={onChange}
        type={type}
        value={value}
        id={id}
        className="
            block
            rounded-md
            px-6
            pt-6 
            pb-1
            w-full
            text-md
            text-white
            bg-neutral-700
            appearance-none
            focus:outline-none
            focus:ring-0
            peer
            invalid:border-b-1
            "
        placeholder=" "
        // focus:ring-0→クリックしたときに周りに表示されるbox-shadowをなくしている
        // invalid:border-b-1→invalid修飾子が無効なときに下線に線を1px引く
      />
      <label
        className="
            absolute
            text-md
          text-zinc-400 
            duration-150
            transform 
            -translate-y-3
            scale-75
            top-4
            z-10 
            origin-top-left
            left-6 
            peer-placeholder-shown:scale-100
            peer-placeholder-shown:translate-y-0
            peer-focus:scale-75
            peer-focus:-translate-y-3
        "
        htmlFor={id} //ラベルを押してもinput属性にカーソルが行き入力できるようになる
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
