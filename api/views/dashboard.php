<section id="dashboard" class="section active">
    <div class="container">
        <div class="card">
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard!</p>
            <div class="new-window-section" style="margin-top: 20px;">
                <button id="open-window-btn" class="btn btn-primary">Open New Window</button>
            </div>
        </div>
    </div>
</section>

<script>
document.getElementById('open-window-btn').addEventListener('click', function() {
    window.open('/new-window.html', '_blank', 'width=400,height=300');
});
</script>