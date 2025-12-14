import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import {
  CreateLeague,
  CreateLeagueSchema,
  ErrorZodResponse,
  FinalCreateLeague,
  FinalCreateLeagueSchema,
  LeagueWithWebSocketEventId,
  ServerCreateLeagueResponseWithQueryParamsAndWebSocketEventId,
} from "../../api/schemas";
import { postLeague } from "../../api/leagues";
import { getTeams } from "../../api/teams";
import Button from "../Button";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSubmitSuccessfull: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsSubmitWithError: Dispatch<SetStateAction<string>>;
}

interface SelectOptionsType {
  value: string;
  label: string;
}

const selectStyles = {
  control: (base: object, state: { isFocused: boolean }) => ({
    ...base,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderColor: state.isFocused ? "#38bdf8" : "#bae6fd",
    borderRadius: "0.75rem",
    padding: "0.25rem",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(56, 189, 248, 0.3)" : "none",
    "&:hover": {
      borderColor: "#7dd3fc",
    },
    transition: "all 0.2s ease-out",
  }),
  option: (
    base: object,
    state: { isSelected: boolean; isFocused: boolean }
  ) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#0ea5e9"
      : state.isFocused
        ? "#e0f2fe"
        : "transparent",
    color: state.isSelected ? "#fff" : "#0c4a6e",
    "&:active": {
      backgroundColor: "#bae6fd",
    },
  }),
  multiValue: (base: object) => ({
    ...base,
    backgroundColor: "#e0f2fe",
    borderRadius: "0.5rem",
  }),
  multiValueLabel: (base: object) => ({
    ...base,
    color: "#0369a1",
    fontWeight: "500",
  }),
  multiValueRemove: (base: object) => ({
    ...base,
    color: "#0369a1",
    "&:hover": {
      backgroundColor: "#bae6fd",
      color: "#0c4a6e",
    },
  }),
  menu: (base: object) => ({
    ...base,
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow: "0 10px 15px -3px rgba(14, 165, 233, 0.1)",
    border: "1px solid #bae6fd",
  }),
  menuPortal: (base: object) => ({
    ...base,
    zIndex: 9999,
  }),
  placeholder: (base: object) => ({
    ...base,
    color: "#7dd3fc",
  }),
};

export default function CreateLeagueForm({
  setIsOpen,
  setIsSubmitSuccessfull,
  setIsLoading,
  setIsSubmitWithError,
}: Props) {
  const queryClient = useQueryClient();

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: ({ signal }) => getTeams(signal),
    refetchOnMount: false,
  });

  const teamOptions = useMemo<SelectOptionsType[]>(() => {
    const teamOptionsArray =
      teamsQuery.data?.map((team) => ({
        value: team.id,
        label: team.teamName,
      })) || [];
    return teamOptionsArray;
  }, [teamsQuery.data]);

  const { mutate, isLoading } = useMutation<
    | LeagueWithWebSocketEventId
    | ServerCreateLeagueResponseWithQueryParamsAndWebSocketEventId,
    ErrorZodResponse,
    FinalCreateLeague
  >({
    mutationFn: postLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
      setIsLoading(false);
      setIsSubmitSuccessfull(true);
      setIsOpen(false);
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.msg || "Error with processing request";
      setIsLoading(false);
      setIsSubmitWithError(errorMessage);
      setIsOpen(true);
    },
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateLeague>({
    resolver: zodResolver(CreateLeagueSchema),
  });

  const onSubmit: SubmitHandler<CreateLeague> = (data) => {
    const validatedLeague = CreateLeagueSchema.parse(data);

    const teamsIdArray: Array<string> = validatedLeague.teamIdToAdd || [];

    const postData = {
      league: {
        leagueName: validatedLeague.leagueName,
      },
      teamsIdToAdd: teamsIdArray,
    };

    const finalLeagueValidation = FinalCreateLeagueSchema.parse(postData);
    mutate(finalLeagueValidation);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="glass rounded-2xl p-6 shadow-glass dark:bg-slate-950/95 dark:border dark:border-slate-800/80 dark:backdrop-blur-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            placeholder="Premier League, La Liga, etc."
            label="League Name"
            {...register("leagueName")}
            error={errors.leagueName?.message}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-linear-700 dark:text-linear-300">
              Teams to Add
            </label>
            <Controller
              control={control}
              name="teamIdToAdd"
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    isMulti
                    styles={selectStyles}
                    options={teamOptions}
                    placeholder="Select teams..."
                    value={teamOptions.filter((option) =>
                      value?.includes(option.value)
                    )}
                    onChange={(chosenTeamArr) => {
                      const chosenTeamIds = chosenTeamArr?.map(
                        (chosenTeamOption) => chosenTeamOption.value
                      );
                      return onChange(chosenTeamIds);
                    }}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                );
              }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isLoading}
            >
              Create League
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
