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
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto m-5"
      >
        <Input
          placeholder="League Name"
          {...register("leagueName")}
          error={errors.leagueName?.message}
        ></Input>
        <Controller
          control={control}
          name="teamIdToAdd"
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                isMulti
                options={teamOptions}
                value={teamOptions.filter((option) =>
                  value?.includes(option.value)
                )}
                onChange={(chosenTeamArr) => {
                  const chosenTeamIds = chosenTeamArr?.map(
                    (chosenTeamOption) => chosenTeamOption.value
                  );
                  return onChange(chosenTeamIds);
                }}
              />
            );
          }}
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
