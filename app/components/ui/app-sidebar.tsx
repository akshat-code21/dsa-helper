import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/app/components/ui/sidebar"
import { Conversation } from "@/app/generated/prisma/client";
import { usePathname, useRouter } from "next/navigation";

export function AppSidebar({ conversations }: { conversations?: Conversation[] }) {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent className="px-4">
                <SidebarGroup />
                {conversations && (
                    <SidebarMenu className="list-none">
                        {conversations.map((conversation) => {
                            const isActive = pathname === `/chat/${conversation.id}`;
                            return (
                                <SidebarMenuItem key={conversation.id}>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            router.push(`/chat/${conversation.id}`);
                                        }}
                                    >
                                        <span className="text-sm font-medium text-foreground">
                                            {conversation.title}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                )}
                {!conversations || conversations.length === 0 && (
                    <div>No conversations found</div>
                )}
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}