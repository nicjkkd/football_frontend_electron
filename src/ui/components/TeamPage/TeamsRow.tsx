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
      className={`flex items-center gap-4 p-4 border-b border-gray-200 ${
        index % 2 === 0 ? "bg-gray-100" : "bg-white"
      }`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-4 w-full"
      >
        <Input
          placeholder="Team Name"
          {...register("teamName")}
          error={errors.teamName?.message}
        ></Input>

        <Input
          placeholder="City"
          {...register("city")}
          error={errors.city?.message}
        ></Input>

        <Input
          placeholder="Created in year..."
          {...register("since")}
          error={errors.since?.message}
        ></Input>

        {isDirty && (
          <Button
            type="submit"
            disabled={isSubmitSuccessful}
            isLoading={isUpdateLoading}
            className="py-2 px-4 bg-gray-800 text-white rounded-md transition-all duration-300 ease-in-out transform scale-95 opacity-0 hover:scale-105 hover:bg-gray-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200 whitespace-nowrap"
            style={{
              animation: "fadeIn 0.3s ease-in-out forwards",
            }}
          >
            Save Changes
          </Button>
        )}
      </form>

      <Button
        type="button"
        className={`py-2 px-4 rounded-lg transition-all ${
          isDeleteLoading || isUpdateLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
        }`}
        title="Delete Team"
        onClick={() => {
          handleClick(team.id);
        }}
        disabled={isDeleteLoading || isUpdateLoading}
      >
        X
      </Button>
    </div>
  );
};

export default memo(TeamsRow);
