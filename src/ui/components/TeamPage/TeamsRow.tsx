import { memo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ListChildComponentProps } from "react-window";
import {
  CreateTeam,
  CreateTeamSchema,
  ErrorZodResponse,
  Team,
  TeamWithWebSocketEventId,
  UpdateTeam,
  UpdateTeamSchema,
} from "../../api/schemas";
import { deleteTeam, updateTeam } from "../../api/teams";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import Button from "../Button";
import { Bounce, toast } from "react-toastify";
import { UpdateTeamProps } from "../../models";
import { useTheme } from "../../context/ThemeContext";

const TeamsRow: React.FC<ListChildComponentProps<Team[]>> = ({
  index,
  style,
  data,
}) => {
  const team = data[index];
  const queryClient = useQueryClient();
  const darkTheme = useTheme();

  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useMutation<
    TeamWithWebSocketEventId,
    ErrorZodResponse,
    string
  >({
    mutationFn: deleteTeam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      console.log(`Deleted:`, data);
    },
  });

  const handleClick = (teamId: string) => {
    deleteMutate(teamId);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isDirty },
    reset,
  } = useForm<CreateTeam>({
    resolver: zodResolver(CreateTeamSchema),
    values: data[index],
  });

  const { mutate: updateMutate, isLoading: isUpdateLoading } = useMutation<
    TeamWithWebSocketEventId,
    ErrorZodResponse,
    UpdateTeamProps
  >({
    mutationFn: ({
      teamId,
      teamChanges,
    }: {
      teamId: string;
      teamChanges: UpdateTeam;
    }) => updateTeam(teamId, teamChanges),
    onSuccess: (data) => {
      console.log(`Updated: `, data);
      queryClient.invalidateQueries({ queryKey: ["teams"] });
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

  const onSubmit: SubmitHandler<CreateTeam> = (data) => {
    console.log(data);
    const validatedTeamChanges = UpdateTeamSchema.parse(data);
    console.log(validatedTeamChanges);
    updateMutate({ teamId: team.id, teamChanges: validatedTeamChanges });
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
          placeholder="Team Name"
          {...register("teamName")}
          error={errors.teamName?.message}
        />

        <Input
          placeholder="City"
          {...register("city")}
          error={errors.city?.message}
        />

        <Input
          placeholder="Founded Year"
          {...register("since")}
          error={errors.since?.message}
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
        title="Delete Team"
        onClick={() => {
          handleClick(team.id);
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

export default memo(TeamsRow);
