import { useParams } from "react-router-dom";
import PageWrapper from "../components/shared/PageWrapper";

/*
  Store detail - alohida do‘kon sahifasi.
  Bu yerda do‘kon haqida ma’lumot, mahsulotlari va reelslari bo‘ladi.
*/

export default function StoreDetail() {
  const { id } = useParams();

  return (
    <PageWrapper className="py-10">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-teal-700">Do‘kon ID: {id}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Store detail sahifasi
        </h1>
        <p className="mt-3 text-slate-600">
          Bu yerda do‘kon banneri, reytingi, mahsulotlari va reelslari chiqadi.
        </p>
      </div>
    </PageWrapper>
  );
}