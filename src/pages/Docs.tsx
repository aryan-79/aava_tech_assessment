const Docs = () => {
  return (
    <div className="p-2 max-w-[600px] mx-auto">
      <h1 className="font-semibold text-3xl mb-6 text-center">Docs</h1>

      <h2 className="font-medium text-lg mb-2">Overview</h2>
      <p className="mb-6">
        This project is built using TypeScript. Vite is used as the build tool
        and development server, for better optimization and overall better
        development experience. For styling, I chose Tailwind CSS based on
        personal preference, and no UI libraries have been used.
      </p>

      <h3 className="font-medium text-lg mb-6">Libraries and Packages Used</h3>
      <div className="space-y-6">
        <div>
          <p className="font-medium">supabase-js:</p>
          <p>
            supabase-js is a client library which provides convenient interface
            for working with Supabase from a React application.
          </p>
        </div>
        <div>
          <p className="font-medium">auth-helpers-react (from supabase):</p>
          <p>
            auth-helpers-react is the supabase auth helper used in react
            application. It provides a convenient way to handle authentication,
            and manage/use session in React application.
          </p>
        </div>
        <div>
          <p className="font-semibold">uuid:</p>
          <p>
            In this project, uuid has been used to create a unique id for each
            post image stored in supabase storage.
          </p>
        </div>
        <div>
          <p className="font-semibold">react-toastify</p>
          <p className="font-normal">
            react-toastify is library for adding toast notifications in React
            applications, providing feedback to users in a simple way.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Docs;
