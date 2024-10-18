// Generated by Xata Codegen 0.30.1. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "Users",
    checkConstraints: {
      Users_xata_id_length_xata_id: {
        name: "Users_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      Users__pgroll_new_ID_key: {
        name: "Users__pgroll_new_ID_key",
        columns: ["ID"],
      },
      Users__pgroll_new_email_key: {
        name: "Users__pgroll_new_email_key",
        columns: ["email"],
      },
      Users__pgroll_new_username_key: {
        name: "Users__pgroll_new_username_key",
        columns: ["username"],
      },
      _pgroll_new_Users_xata_id_key: {
        name: "_pgroll_new_Users_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "ID",
        type: "int",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "email",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "password",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "role",
        type: "multiple",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "username",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "comment",
    checkConstraints: {
      comment_xata_id_length_xata_id: {
        name: "comment_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_comment_xata_id_key: {
        name: "_pgroll_new_comment_xata_id_key",
        columns: ["xata_id"],
      },
      comment__pgroll_new_ID_key: {
        name: "comment__pgroll_new_ID_key",
        columns: ["ID"],
      },
    },
    columns: [
      {
        name: "ID",
        type: "int",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "comment",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "project",
    checkConstraints: {
      project_xata_id_length_xata_id: {
        name: "project_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_project_xata_id_key: {
        name: "_pgroll_new_project_xata_id_key",
        columns: ["xata_id"],
      },
      project__pgroll_new_ID_key: {
        name: "project__pgroll_new_ID_key",
        columns: ["ID"],
      },
      project__pgroll_new_name_key: {
        name: "project__pgroll_new_name_key",
        columns: ["name"],
      },
    },
    columns: [
      {
        name: "ID",
        type: "int",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "name",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "task",
    checkConstraints: {
      task_xata_id_length_xata_id: {
        name: "task_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_task_xata_id_key: {
        name: "_pgroll_new_task_xata_id_key",
        columns: ["xata_id"],
      },
      task__pgroll_new_ID_key: {
        name: "task__pgroll_new_ID_key",
        columns: ["ID"],
      },
    },
    columns: [
      {
        name: "ID",
        type: "int",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "description",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "due_date",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "status",
        type: "bool",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "team",
    checkConstraints: {
      team_xata_id_length_xata_id: {
        name: "team_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_team_xata_id_key: {
        name: "_pgroll_new_team_xata_id_key",
        columns: ["xata_id"],
      },
      team__pgroll_new_ID_key: {
        name: "team__pgroll_new_ID_key",
        columns: ["ID"],
      },
      team__pgroll_new_username_key: {
        name: "team__pgroll_new_username_key",
        columns: ["name"],
      },
    },
    columns: [
      {
        name: "ID",
        type: "int",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "description",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "name",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Users = InferredTypes["Users"];
export type UsersRecord = Users & XataRecord;

export type Comment = InferredTypes["comment"];
export type CommentRecord = Comment & XataRecord;

export type Project = InferredTypes["project"];
export type ProjectRecord = Project & XataRecord;

export type Task = InferredTypes["task"];
export type TaskRecord = Task & XataRecord;

export type Team = InferredTypes["team"];
export type TeamRecord = Team & XataRecord;

export type DatabaseSchema = {
  Users: UsersRecord;
  comment: CommentRecord;
  project: ProjectRecord;
  task: TaskRecord;
  team: TeamRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://GICHUKI-KAMAU-s-workspace-fhao0l.us-east-1.xata.sh/db/project1",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};