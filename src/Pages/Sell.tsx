// import { ValueContext } from "@/Context/ValueContext";
// import useQueryGet from "@/hooks/useQueryGet";
// import UseQueryPost from "@/hooks/useQueryPost";
// import {
//   AllProperties,
//   AvailableOptions,
//   HeaderProperties,
//   OurTeam,
//   Search,
// } from "@/Sections/Buy";
// import DevelopersServices from "@/Services/DevelopersServices";
// import PropertiesServices from "@/Services/PropertiesServices";
// import { useContext, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const Sell = () => {
//   const paramsId = useParams();
//   const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);
//   const { data: filterDeveloper } = useQueryGet(
//     ["filterDeveloper"],
//     DevelopersServices.developer
//   );
//   const { values, setValues ,valueSearch,setValueSearch,searchId,setSearchId} = useContext(ValueContext);

//   const { mutateAsync, data } = UseQueryPost(
//     ["search"],
//     PropertiesServices.Search
//   );
//   useEffect(() => {
//     mutateAsync(values);
//   }, [paramsId.id, values?.property_ids]);
//   return (
//     <div className="w-full h-full pt-[80px] md:pt-[100px] lg:pt-[87.2px]">
//       {/* <Search
//       from = "sell"
  

//         item={filter}
//         filterDeveloper={filterDeveloper}
//         options ={data}
//         values={values}
//         setValues={setValues}
//         valueSearch={valueSearch}
//         setValueSearch={setValueSearch}
//         setSearchId={setSearchId}
//         searchId= {searchId}
//         onClick={mutateAsync}
//       />
//       <HeaderProperties values={values} setValues={setValues} />
//       {data?.data?.data?.properties.length == 0 ? (
//         <p className="text-[25px] font-[800] text-primary flex-center py-[100px]">
//           no data found
//         </p>
//       ) : (
//         <AllProperties item={data?.data?.data} />
//       )}{" "}
//       <OurTeam />
//       <AvailableOptions /> */}
//     </div>
//   );
// };

// export default Sell;
