import { memo, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ListChildComponentProps } from "react-window";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import {
  ErrorZodResponse,
  PlayerWithWebSocketEventId,
  UpdatePlayer,
  UpdatePlayerForm,
  UpdatePlayerSchema,
} from "../../api/schemas";
import { deletePlayer, updatePlayer } from "../../api/players";
import { getTeams } from "../../api/teams";
import {
  PlayerWithTeamName,
  SelectOptionsType,
  UpdatePlayerProps,
} from "../../models";
import Button from "../Button";
import { Bounce, toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

const selectStyles = {
  control: (base: object, state: { isFocused: boolean }) => ({
    ...base,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderColor: state.isFocused ? "#38bdf8" : "#bae6fd",
    borderRadius: "0.75rem",
    padding: "0.125rem",
    minHeight: "42px",
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
  }),
  menu: (base: object) => ({
    ...base,
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow: "0 10px 15px -3px rgba(14, 165, 233, 0.1)",
    border: "1px solid #bae6fd",
    zIndex: 9999,
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

const PlayersRow: React.FC<ListChildComponentProps<PlayerWithTeamName[]>> = ({
  index,
  style,
  data,
}) => {
  const player = data[index];
  const queryClient = useQueryClient();
  const darkTheme = useTheme();

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

  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useMutation<
    PlayerWithWebSocketEventId,
    ErrorZodResponse,
    string
  >({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });

  const handleClick = (playerId: string) => {
    deleteMutate(playerId);
  };

  const rawValues = data[index];
  const defaultValues = useMemo(() => {
    if (rawValues.dateBirth) {
      return {
        ...rawValues,
        dateBirth: new Date(rawValues?.dateBirth).toISOString().split("T")[0],
      };
    } else {
      return rawValues;
    }
  }, [rawValues]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isSubmitSuccessful },
    reset,
  } = useForm<UpdatePlayerForm>({
    resolver: zodResolver(UpdatePlayerSchema),
    values: defaultValues,
    defaultValues: defaultValues,
  });

  const { mutate: updateMutate, isLoading: isUpdateLoading } = useMutation<
    PlayerWithWebSocketEventId,
    ErrorZodResponse,
    UpdatePlayerProps
  >({
    mutationFn: ({
      playerId,
      playerChanges,
    }: {
      playerId: string;
      playerChanges: UpdatePlayer;
    }) => updatePlayer(playerId, playerChanges),
    onSuccess: (data) => {
      console.log(`Updated: `, data);
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.msg || "Error with processing request",
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: darkTheme ? "dark" : "light",
          transition: Bounce,
        }
      );
      reset();
    },
  });

  const onSubmit: SubmitHandler<UpdatePlayerForm> = (data) => {
    let dataToSubmit = { ...data };

    if (!data.teamId && !data.playerNumber) {
      dataToSubmit = {
        ...data,
        teamId: null,
        playerNumber: null,
      };
    }

    if (!data.position) {
      dataToSubmit.position = null;
    }

    if (!data.dateBirth) {
      dataToSubmit.dateBirth = undefined;
    }

    const validatedPlayerChanges = UpdatePlayerSchema.parse(dataToSubmit);
    console.log(validatedPlayerChanges);
    updateMutate({
      playerId: player.id,
      playerChanges: validatedPlayerChanges,
    });
  };

  return (
    <div
      style={style}
      className={`
        flex items-center gap-4 p-4 
        transition-all duration-200 ease-out
        ${
          index % 2 === 0
            ? "bg-linear-50/50 dark:bg-surface-dark-tertiary/50"
            : "bg-white/80 dark:bg-surface-dark-secondary/80"
        }
        hover:bg-linear-100/80 dark:hover:bg-linear-900/30
        border-b border-linear-100 dark:border-linear-900/50
      `}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-4 w-full"
      >
        <Input
          placeholder="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
        />

        <Input
          placeholder="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
        />

        <Input
          placeholder="Birth Date"
          type="date"
          {...register("dateBirth")}
          error={errors.dateBirth?.message}
        />

        <Input
          placeholder="Position"
          {...register("position")}
          error={errors.position?.message}
        />

        <Input
          placeholder="#"
          {...register("playerNumber")}
          error={errors.playerNumber?.message}
        />

        <Controller
          control={control}
          name="teamId"
          render={({ field: { onChange, value } }) => (
            <Select
              styles={selectStyles}
              options={teamOptions}
              value={teamOptions.filter(
                (teamOption) => teamOption.value === value
              )}
              onChange={(chosenTeam) => {
                return onChange(chosenTeam?.value);
              }}
              placeholder="Team"
              isClearable
              className="min-w-[150px]"
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          )}
        />

        {isDirty && (
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitSuccessful}
            isLoading={isUpdateLoading}
            className="whitespace-nowrap animate-fade-in"
          >
            Save
          </Button>
        )}
      </form>

      <Button
        type="button"
        variant="danger"
        className="!px-3 !py-2"
        title="Delete Player"
        onClick={() => {
          handleClick(player.id);
        }}
        disabled={isDeleteLoading || isUpdateLoading}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </Button>
    </div>
  );
};

export default memo(PlayersRow);
