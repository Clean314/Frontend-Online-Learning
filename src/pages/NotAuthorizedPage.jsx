export default function NotAuthorizedPage() {
    return (
        <div style={{ padding: 24, textAlign: "center" }}>
            <h2>🚫 접근 권한이 없습니다</h2>
            <p>
                해당 페이지에 대한 권한이 없거나, 로그인한 계정으로는 접근할 수
                없습니다.
            </p>
        </div>
    );
}
