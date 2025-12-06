import { memo, useCallback, useEffect, useState } from "react";
import CreateTeamForm from "./CreateTeamForm";
import Loader from "../Loader";

const CreateTeam = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitWithError, setIsSubmitWithError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setIsSubmitSuccessfull(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isSubmitSuccessfull) {
      setTimeout(() => setIsSubmitSuccessfull(false), 3000);
    }
  }, [isSubmitSuccessfull]);

  useEffect(() => {
    if (isSubmitWithError) {
      setIsOpen(true);
      setTimeout(() => {
        setIsSubmitWithError("");
      }, 3000);
    }
  }, [isSubmitWithError]);

  useEffect(() => {
    if (isLoading) setIsOpen(false);
  }, [isLoading]);

  const handleClick = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  return (
    <>
      <div className="w-full my-5 flex justify-center">
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className={`py-2.5 px-5 text-sm font-medium rounded-lg focus:outline-none ${
            isLoading
              ? "text-gray-400 bg-gray-200 border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 dark:border-gray-700"
              : "py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          }`}
        >
          {isOpen ? "Close Form" : "Add Team"}
        </button>
      </div>
      {isLoading ? <Loader styles="flex items-center justify-center" /> : null}
      {isSubmitSuccessfull ? (
        <div className="text-green-800 bg-green-100 border border-green-200 p-3 rounded-md text-center">
          Team was successfully created!
        </div>
      ) : null}
      {isSubmitWithError && isOpen ? (
        <div className="text-red-800 bg-red-100 border border-red-200 p-3 rounded-md text-center mb-4">
          {isSubmitWithError}
        </div>
      ) : null}
      {isOpen ? (
        <CreateTeamForm
          setIsOpen={setIsOpen}
          setIsSubmitSuccessfull={setIsSubmitSuccessfull}
          setIsLoading={setIsLoading}
          setIsSubmitWithError={setIsSubmitWithError}
        />
      ) : null}
    </>
  );
};

export default memo(CreateTeam);
