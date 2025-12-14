import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import {
  CreatePlayerSchema,
  CreatePlayer,
  ErrorZodResponse,
  PlayerWithWebSocketEventId,
} from "../../api/schemas";
import { postPlayer } from "../../api/players";
import { getTeams } from "../../api/teams";
import { SelectOptionsType } from "../../models";
import Button from "../Button";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSubmitSuccessfull: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsSubmitWithError: Dispatch<SetStateAction<string>>;
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
  singleValue: (base: object) => ({
    ...base,
    color: "#0c4a6e",
  }),
};

export default function CreatePlayerForm({
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
    PlayerWithWebSocketEventId,
    ErrorZodResponse,
    CreatePlayer
  >({
    mutationFn: postPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
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
  } = useForm<CreatePlayer>({
    resolver: zodResolver(CreatePlayerSchema),
  });

  const onSubmit: SubmitHandler<CreatePlayer> = (data) => {
    console.log(data);
    let initialData = { ...data };

    if (!data.teamId && !data.playerNumber) {
      initialData = {
        ...data,
        teamId: null,
        playerNumber: null,
      };
    }

    if (!data.position) {
      initialData.position = null;
    }

    if (!data.dateBirth) {
      initialData.dateBirth = undefined;
    }

    const validatedPlayer = CreatePlayerSchema.parse(initialData);
    mutate(validatedPlayer);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="glass rounded-2xl p-6 shadow-glass dark:bg-slate-950/95 dark:border dark:border-slate-800/80 dark:backdrop-blur-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            placeholder="John"
            label="First Name"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            placeholder="Doe"
            label="Last Name"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
          <Input
            placeholder="BENCH, SW, LB, LCB, etc."
            label="Position"
            {...register("position")}
            error={errors.position?.message}
          />
          <Input
            placeholder="Select date"
            label="Birth Date"
            type="date"
            {...register("dateBirth")}
            error={errors.dateBirth?.message}
          />
          <Input
            placeholder="e.g. 10"
            label="Player Number"
            {...register("playerNumber")}
            error={errors.playerNumber?.message}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-linear-700 dark:text-linear-300">
              Team
            </label>
            <Controller
              control={control}
              name="teamId"
              render={({ field: { onChange, value } }) => (
                <Select
                  styles={selectStyles}
                  options={teamOptions}
                  placeholder="Select a team..."
                  isClearable
                  value={teamOptions.filter(
                    (teamOption) => teamOption.value === value
                  )}
                  onChange={(chosenTeam) => {
                    console.log(chosenTeam);
                    return onChange(chosenTeam?.value);
                  }}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              )}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isLoading}
            >
              Create Player
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
