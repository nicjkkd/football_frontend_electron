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
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto m-5"
      >
        <Input
          placeholder="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
        ></Input>
        <Input
          placeholder="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
        ></Input>
        <Input
          placeholder="Position"
          {...register("position")}
          error={errors.position?.message}
        ></Input>
        <Input
          placeholder="Birth Date"
          type="date"
          {...register("dateBirth")}
          error={errors.dateBirth?.message}
        ></Input>
        <Input
          placeholder="Player Number"
          {...register("playerNumber")}
          error={errors.playerNumber?.message}
        ></Input>

        <Controller
          control={control}
          name="teamId"
          render={({ field: { onChange, value } }) => (
            <Select
              options={teamOptions}
              value={teamOptions.filter(
                (teamOption) => teamOption.value === value
              )}
              onChange={(chosenTeam) => {
                console.log(chosenTeam);
                return onChange(chosenTeam?.value);
              }}
            />
          )}
        />

        <Button
          type="submit"
          className="w-full py-2 bg-gray-800 text-white rounded-md transition hover:bg-gray-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200"
          disabled={isLoading}
        >
          Submit
        </Button>
        <Button
          type="button"
          className="w-full py-2 bg-gray-800 text-white rounded-md transition hover:bg-gray-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200"
          onClick={handleReset}
        >
          Reset Form
        </Button>
      </form>
    </div>
  );
}
