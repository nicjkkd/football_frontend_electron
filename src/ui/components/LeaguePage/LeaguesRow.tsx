import { memo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ListChildComponentProps } from "react-window";
import {
  ErrorZodResponse,
  League,
  LeagueWithWebSocketEventId,
  UpdateLeague,
  UpdateLeagueSchema,
} from "../../api/schemas";
import { deleteLeague, updateLeague } from "../../api/leagues";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";
import Button from "../Button";
import { Bounce, toast } from "react-toastify";
import { UpdateLeagueProps } from "../../models";
import { useTheme } from "../../context/ThemeContext";

const LeaguesRow: React.FC<ListChildComponentProps<League[]>> = ({
  index,
  style,
  data,
}) => {
  const league = data[index];
  const queryClient = useQueryClient();
  const darkTheme = useTheme();

  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useMutation<
    LeagueWithWebSocketEventId,
    ErrorZodResponse,
    string
  >({
    mutationFn: deleteLeague,
    onSuccess: (data) => {
      console.log(`Deleted:`, data);
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
    },
  });

  const handleClick = (leagueId: string) => {
    deleteMutate(leagueId);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitSuccessful },
    reset,
  } = useForm<UpdateLeague>({
    resolver: zodResolver(UpdateLeagueSchema),
    values: data[index],
  });

  const { mutate: updateMutate, isLoading: isUpdateLoading } = useMutation<
    LeagueWithWebSocketEventId,
    ErrorZodResponse,
    UpdateLeagueProps
  >({
    mutationFn: ({
      leagueId,
      leagueChanges,
    }: {
      leagueId: string;
      leagueChanges: UpdateLeague;
    }) => updateLeague(leagueId, leagueChanges),
    onSuccess: (data) => {
      console.log(`Updated: `, data);
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
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

  const onSubmit: SubmitHandler<UpdateLeague> = (data) => {
    console.log(data);
    const validatedLeagueChanges = UpdateLeagueSchema.parse(data);
    console.log(validatedLeagueChanges);
    updateMutate({
      leagueId: league.id,
      leagueChanges: validatedLeagueChanges,
    });
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
          placeholder="League Name"
          {...register("leagueName")}
          error={errors.leagueName?.message}
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
        title="Delete League"
        onClick={() => {
          handleClick(league.id);
        }}
        disabled={isDeleteLoading || isUpdateLoading}
      >
        X
      </Button>
    </div>
  );
};

export default memo(LeaguesRow);
