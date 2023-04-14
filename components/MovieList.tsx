//useMovieListから取得した映画情報を基にmap関数でlength分出力している
import React from "react";

import { isEmpty } from "lodash";
import MovieCard from "./MovieCard";

interface MovieListProps {
  // キーが文字列型で、値が任意の型を持つオブジェクトを表します。
  // そして、配列の要素にRecord<string, any>を指定することで、
  // 複数のキーが文字列型で、値が任意の型を持つオブジェクトから成る配列を表します。
  data: Record<string, any>[];
  title: string;
}

const MovieList = ({ data, title }: MovieListProps) => {
  if(isEmpty(data)){
      return null;
  }

  return (
    // pace-y-8は、要素間の余白を調整する際に使用する
    <div className="px-4 md:px-12 mt-4 space-y-8">
      <div>
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
          {title}
        </p>
        <div className="grid grid-cols-4 gap-2">
            {data.map((movie) => {
                return(
                    // <MovieCard key={movie.id} data={movie}/>
                    <MovieCard key={movie.id} data={movie} />
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
