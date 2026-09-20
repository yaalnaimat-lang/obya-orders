// ==============================
// ADMIN AUTHENTICATION GUARD
// ==============================

async function protectAdminPage() {

    const {
        data: {
            session
        },
        error: sessionError
    } =
        await obyaSupabase.auth
            .getSession();


    // SESSION CHECK FAILED
    if (
        sessionError ||
        !session
    ) {

        window.location.replace(
            "./login.html"
        );

        return false;

    }


    // ==============================
    // CHECK ADMIN ACCESS
    // ==============================

    const {
        data: adminUser,
        error: adminError
    } =
        await obyaSupabase
            .from(
                "admin_users"
            )
            .select(
                "user_id"
            )
            .eq(
                "user_id",
                session.user.id
            )
            .maybeSingle();


    // LOGGED IN BUT NOT AN ADMIN
    if (
        adminError ||
        !adminUser
    ) {

        await obyaSupabase.auth
            .signOut();


        window.location.replace(
            "./login.html"
        );

        return false;

    }


    // ==============================
    // AUTHORIZED ADMIN
    // ==============================

    document.body.style.visibility =
        "visible";


    return true;

}


// Make authorization available
// to the rest of the Admin scripts.

window.obyaAdminReady =
    protectAdminPage();


// ==============================
// ADMIN LOGOUT
// ==============================

document.addEventListener(
    "click",
    async function (event) {

        const logoutButton =
            event.target.closest(
                "#admin-logout-button"
            );


        if (!logoutButton) {
            return;
        }

        event.preventDefault();

        logoutButton.disabled =
            true;

        const {
            error
        } =
            await obyaSupabase.auth
                .signOut({
                    scope: "local"
                });

        if (error) {

            console.error(
                "Could not sign out:",
                error
            );

            logoutButton.disabled =
                false;


            alert(
                "Could not log out. Please try again."
            );

            return;

        }

        window.location.replace(
            "./login.html"
        );

    }
);