<?php
$wgExtensionCredits['parserhook'][] = array(
    'path' => __FILE__,
    'name' => 'LNF',
    'author' => 'Jim Getty', 
    'url' => 'http://lnf.umich.edu', 
    'description' => 'Some LNF customizations for MediaWiki',
    'version'  => 0.2
);

$wgAutoloadClasses['LNF'] = __DIR__ . '/LNF.body.php';
$wgAutoloadClasses['LNFHooks'] = __DIR__ . '/LNF.hooks.php';

$wgResourceModules['ext.LNF'] = array(
	"scripts"		=> array("js/lnf.js"),
	"styles"		=> array("css/lnf.css"),	
	"localBasePath"	=> __DIR__,
	"remoteExtPath"	=> "LNF"
);

$wgExtensionMessagesFiles['LNFMagic'] = __DIR__ . '/LNF.i18n.magic.php';

$wgHooks['BeforePageDisplay'][] = 'LNFHooks::onBeforePageDisplay';

$wgHooks['ParserFirstCallInit'][] = 'LNFHooks::onParserFirstCallInit';