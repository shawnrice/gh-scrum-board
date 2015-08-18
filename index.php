<?php
if ( ! file_exists( __DIR__ . '/data/gh-scrum-board' ) ) {
	mkdir( __DIR__ . '/data/gh-scrum-board' );
}

$ch = curl_init( "https://api.github.com/repos/shawnrice/gh-scrum-board/issues" );
curl_setopt( $ch, CURLOPT_HTTPHEADER, [
  'Accept: application/vnd.github.v3+json',
  ]);
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch, CURLOPT_USERAGENT, 'scrum-board' );
$json = curl_exec( $ch );
curl_close( $ch );
file_put_contents( __DIR__ . '/data/issues.json', $json );


$ch = curl_init( "https://api.github.com/repos/shawnrice/gh-scrum-board/labels" );
curl_setopt( $ch, CURLOPT_HTTPHEADER, [
  'Accept: application/vnd.github.v3+json',
  ]);
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch, CURLOPT_USERAGENT, 'scrum-board' );
$json = curl_exec( $ch );
curl_close( $ch );
file_put_contents( __DIR__ . '/data/labels.json', $json );

// THIS REQUIRES AUTHENTICATION
// $ch = curl_init( "https://api.github.com/repos/shawnrice/gh-scrum-board/collaborators" );
// curl_setopt( $ch, CURLOPT_HTTPHEADER, [
//   'Accept: application/vnd.github.v3+json',
//   ]);
// curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
// curl_setopt( $ch, CURLOPT_USERAGENT, 'scrum-board' );
// $json = curl_exec( $ch );
// curl_close( $ch );
// file_put_contents( __DIR__ . '/data/gh-scrum-board/collaborators.json', $json );