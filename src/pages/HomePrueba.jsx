import Sidebar from "./Sidebar";

const HomePrueba = () => {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-semibold">Contenido principal</h1>
        </main>
      </div>
    </>
  );
};

export default HomePrueba;
