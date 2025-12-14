import { memo, useCallback, useEffect, useState } from "react";
import CreatePlayerForm from "./CreatePlayerForm";
import Loader from "../Loader";

const CreatePlayer = () => {
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
      <div className="w-full my-6 flex justify-center">
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className={`
            group relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium
            transition-all duration-300 ease-out
            hover:-translate-y-0.5 active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-linear-400/50 focus:ring-offset-2
            ${
              isLoading
                ? "bg-linear-100 dark:bg-slate-950 text-linear-400 dark:text-slate-500 cursor-not-allowed"
                : isOpen
                  ? "bg-linear-100 dark:bg-slate-900 text-linear-700 dark:text-linear-300 border border-linear-300 dark:border-slate-700"
                  : "bg-gradient-to-r from-linear-500 to-linear-600 text-white hover:from-linear-400 hover:to-linear-500 hover:shadow-linear-lg dark:from-linear-600 dark:to-linear-700 dark:hover:from-linear-500 dark:hover:to-linear-600"
            }
          `}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {isOpen ? "Close Form" : "Add Player"}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader styles="w-10 h-10" />
        </div>
      )}

      {isSubmitSuccessfull && (
        <div className="animate-slide-up max-w-md mx-auto mb-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">
              Player was successfully created!
            </span>
          </div>
        </div>
      )}

      {isSubmitWithError && isOpen && (
        <div className="animate-slide-up max-w-md mx-auto mb-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{isSubmitWithError}</span>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="animate-slide-up">
          <CreatePlayerForm
            setIsOpen={setIsOpen}
            setIsSubmitSuccessfull={setIsSubmitSuccessfull}
            setIsLoading={setIsLoading}
            setIsSubmitWithError={setIsSubmitWithError}
          />
        </div>
      )}
    </>
  );
};

export default memo(CreatePlayer);
