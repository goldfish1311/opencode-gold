import { Button } from "@opencode-ai/ui/button"
import { useDialog } from "@opencode-ai/ui/context/dialog"
import { Dialog } from "@opencode-ai/ui/dialog"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { TextField } from "@opencode-ai/ui/text-field"
import { showToast } from "@opencode-ai/ui/toast"
import { createStore } from "solid-js/store"
import { useLanguage } from "@/context/language"
import { useSDK } from "@/context/sdk"

type McpConfig = {
  name: string
  command: string
}

export function DialogAddMcp() {
  const dialog = useDialog()
  const sdk = useSDK()
  const language = useLanguage()

  const [form, setForm] = createStore<McpConfig>({
    name: "",
    command: "",
  })

  const goBack = () => {
    dialog.close()
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.command.trim()) return

    try {
      const currentConfig = await sdk.client.config.get()
      const currentMcp = currentConfig.data?.mcp ?? {}
      
      const newMcpConfig = {
        ...currentMcp,
        [form.name]: {
          type: "local" as const,
          command: form.command.split(" ").filter(Boolean),
        },
      }

      await sdk.client.config.update({
        config: {
          mcp: newMcpConfig,
        },
      })

      dialog.close()
      showToast({
        variant: "success",
        title: `MCP "${form.name}" added`,
      })
    } catch (err) {
      console.error("Failed to add MCP:", err)
      showToast({
        variant: "error",
        title: "Failed to add MCP",
        description: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return (
    <Dialog
      title={
        <div class="flex items-center gap-2">
          <IconButton
            tabIndex={-1}
            icon="arrow-left"
            variant="ghost"
            onClick={goBack}
            aria-label={language.t("common.goBack")}
          />
          <span>Add MCP Server</span>
        </div>
      }
      transition
    >
      <form onSubmit={handleSubmit} class="px-4 pb-4 flex flex-col gap-4">
        <p class="text-14-regular text-text-base">
          Add a new MCP server. Enter the command to run the server.
        </p>

        <TextField
          autofocus
          label="Name"
          placeholder="my-mcp-server"
          value={form.name}
          onChange={(v) => setForm("name", v)}
        />

        <TextField
          label="Command"
          placeholder="npx -y @modelcontextprotocol/server-sequential-thinking"
          description="The command to run the MCP server"
          value={form.command}
          onChange={(v) => setForm("command", v)}
        />

        <Button
          type="submit"
          variant="primary"
          disabled={!form.name.trim() || !form.command.trim()}
        >
          Add
        </Button>
      </form>
    </Dialog>
  )
}
