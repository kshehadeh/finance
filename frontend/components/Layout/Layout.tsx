import {
    AppShell,
    Navbar,
    Header,
    MantineProvider,
    useMantineTheme,
    Aside,
    Burger,
    Footer,
    MediaQuery,
    Text,
} from "@mantine/core";
import { PropsWithChildren, useState } from "react";

export default function Layout({ children }: PropsWithChildren) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                /** Put your mantine theme override here */
                colorScheme: "light",
            }}
        >
            return (
            <AppShell
                styles={{
                    main: {
                        background:
                            theme.colorScheme === "dark"
                                ? theme.colors.dark[8]
                                : theme.colors.gray[0],
                    },
                }}
                navbarOffsetBreakpoint="sm"
                asideOffsetBreakpoint="sm"
                navbar={
                    <Navbar
                        p="md"
                        hiddenBreakpoint="sm"
                        hidden={!opened}
                        width={{ sm: 200, lg: 300 }}
                    >
                        <Text>Finance Thingy</Text>
                    </Navbar>
                }
                aside={
                    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                        <Aside
                            p="md"
                            hiddenBreakpoint="sm"
                            width={{ sm: 200, lg: 300 }}
                        >
                            <Text>Application sidebar</Text>
                        </Aside>
                    </MediaQuery>
                }
                footer={
                    <Footer height={60} p="md">
                        Application footer
                    </Footer>
                }
                header={
                    <Header height={{ base: 50, md: 70 }} p="md">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >
                            <MediaQuery
                                largerThan="sm"
                                styles={{ display: "none" }}
                            >
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.gray[6]}
                                    mr="xl"
                                />
                            </MediaQuery>

                            <Text>Finance Thingy</Text>
                        </div>
                    </Header>
                }
            >
                {children}
            </AppShell>
        </MantineProvider>
    );
}
