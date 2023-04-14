// playボタンを押した際のidに基づき情報を取得する
import useSwr from "swr";
import fetcher from "../libs/fetcher";

const useMovie = (id?: string) => {
  
    const { data, error, isLoading } = useSwr(id ? `/api/movies/${id}` : null, fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    });
    // console.log(data)
    return {
      data,
      error,
      isLoading
    }
  };

  export default useMovie;