<section id="dashboard" class="section active">
    <div class="container">
        <div class="card">
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard!</p>
            <div class="new-window-section" style="margin-top: 20px;">
                <button id="open-window-btn" class="btn btn-primary">Open New Window</button>
            </div>
            <div class="same-window-section" style="margin-top: 20px;">
                <button id="same-window-btn" class="btn btn-primary">Open Same Window</button>
            </div>
        </div>
    </div>
</section>

<script>
document.getElementById('same-window-btn').addEventListener('click', function() {
    window.location.href = '/settings';
});
document.getElementById('open-window-btn').addEventListener('click', function() {
    window.open('/settings', '_blank', 'width=400,height=300');
});
</script>