import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";

import useCurrentUser from "../hooks/useCurrentUser";
import useFavorites from "../hooks/useFavorites";

interface FavoriteButtonProps {
  movieId: string;
}

const FavoriteButton = ({ movieId }: FavoriteButtonProps) => {
  const { mutate: mutateFavorites } = useFavorites();
  const { data: currentUser, mutate } = useCurrentUser();

  //useEffectでも同じように動作させることができるが、
  //useEffectは毎回レンダリングのたびに実行されるため、
  //usememoの方がパフォーマンスが向上する
  const isFavorite = useMemo(() => {
    //listには必ず配列が入る、データがなくても空配列を格納する
    const list = currentUser?.favoriteIds || [];

    //includesがboolenでしか返さないためisFavoriteに返す値は
    //isFavoriteは常にtrueまたはfalseのいずれかになる
    //またその判別はmovieIdに対して（映画に振り分けられたIDに対して判別を行う）
    return list.includes(movieId);
  }, [currentUser, movieId]);

  const toggleFavorites = useCallback(async () => {
    let response;

    if (isFavorite) {
      //movieIdにはmovieのidが含まれている
      // お気に入りにデータが格納されている場合はDELETEの処理を行う
      // DELETEリクエストを送る場合はdataオブジェクトを指定する必要がある
      response = await axios.delete("/api/favorite", {
        data: { movieId },
      });
    } else {
      // 下記ではできない
      // response = await axios.post('/api/favorite', {data:{ movieId }});
      // 下記ではできる
      response = await axios.post('/api/favorite', { movieId });	
    }

    const updatedFavoriteIds  = response?.data?.favoriteIds;

    // 現在のユーザーのお気に入りリストを更新する
    mutate({
      // 現在のユーザーデータを展開し、お気に入りの更新が必要な部分だけを上書きする

      // オブジェクトの展開演算子で、現在のユーザーデータのすべてのプロパティを展開して新しいオブジェクトを作成します
      ...currentUser,
      //   favoriteIdsプロパティをupdateFavoriteIdsに更新しています。
      favoriteIds: updatedFavoriteIds ,
    });

    //APIから最新のデータを取得して、キャッシュを更新
    mutateFavorites();
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;
  return (
    <div onClick={toggleFavorites} className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300">
      <Icon className="text-white group-hover/item:text-neutral-300 w-4 lg:w-6" />
    </div>
  )
}

export default FavoriteButton;
