//navbarでの連続する内容をひとまとめにしている。
import React from "react";

interface NavbarItemProps {
  label: string;
  type?: string; //必須のプロパティではないときにつける　「？」
}
// React.FCはreactのコンポネントであることを明示している

//   const Input = ({ label}: InputProps) => {//typescriptでの簡易的な宣言

const NavbarItem = ({ label }: NavbarItemProps) => {
  return (
    <>
      <div className="text-white cursor-pointer hover:text-gray-300 transition">
        {label}
      </div>
    </>
  );
};

export default NavbarItem;
